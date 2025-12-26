BEGIN;

------------------------------------------------------------
-- USERS
------------------------------------------------------------

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    username varchar(64) NOT NULL,
    nickname varchar(128) NOT NULL,
    public_id varchar(64) NOT NULL,
    password varchar(255) NOT NULL,
    created_at timestamptz DEFAULT (now() AT TIME ZONE 'utc') NOT NULL,
    updated_at timestamptz DEFAULT (now() AT TIME ZONE 'utc') NOT NULL
);

-- Primary key for users
ALTER TABLE public.users
ADD CONSTRAINT users_pkey
PRIMARY KEY (id);

-- Enforces unique login identifier
CREATE UNIQUE INDEX users_username_unique
ON public.users (username);

-- Enforces unique public identifier used in invitations
CREATE UNIQUE INDEX users_public_id_unique
ON public.users (public_id);

------------------------------------------------------------
-- REFRESH TOKENS
------------------------------------------------------------

CREATE TABLE public.refresh_tokens (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    token text NOT NULL,
    revoked boolean DEFAULT false NOT NULL,
    created_at timestamptz DEFAULT (now() AT TIME ZONE 'utc') NOT NULL,
    expires_at timestamptz NOT NULL,
    revoked_at timestamptz
);

-- Primary key for refresh tokens
ALTER TABLE public.refresh_tokens
ADD CONSTRAINT refresh_tokens_pkey
PRIMARY KEY (id);

-- Guarantees refresh token string uniqueness
CREATE UNIQUE INDEX refresh_tokens_token_unique
ON public.refresh_tokens (token);

-- Optimizes lookup of refresh tokens by user
CREATE INDEX refresh_tokens_user_id_idx
ON public.refresh_tokens (user_id);

-- Ensures refresh tokens always belong to a valid user
ALTER TABLE public.refresh_tokens
ADD CONSTRAINT refresh_tokens_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES public.users(id)
ON UPDATE CASCADE
ON DELETE CASCADE;

------------------------------------------------------------
-- SPACES
------------------------------------------------------------

CREATE TYPE public."SpaceType" AS ENUM ('personal', 'group');

CREATE TABLE public.spaces (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name varchar(255) NOT NULL,
    type public."SpaceType" NOT NULL,
    owner_id uuid NOT NULL,
    created_at timestamptz DEFAULT (now() AT TIME ZONE 'utc') NOT NULL,
    updated_at timestamptz DEFAULT (now() AT TIME ZONE 'utc') NOT NULL
);

-- Primary key for spaces
ALTER TABLE public.spaces
ADD CONSTRAINT spaces_pkey
PRIMARY KEY (id);

-- Ensures every space has a valid owner
ALTER TABLE public.spaces
ADD CONSTRAINT spaces_owner_id_fkey
FOREIGN KEY (owner_id)
REFERENCES public.users(id)
ON UPDATE CASCADE
ON DELETE RESTRICT;

------------------------------------------------------------
-- SPACE INVITATIONS
------------------------------------------------------------

CREATE TYPE public."SpaceInvitationStatus" AS ENUM (
  'pending',
  'accepted',
  'declined',
  'expired'
);

CREATE TYPE public."SpaceInvitationType" AS ENUM (
  'direct',
  'link'
);

CREATE TABLE public.space_invitations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    space_id uuid NOT NULL,
    user_public_id varchar(64),
    created_by uuid NOT NULL,
    token varchar(255),
    type public."SpaceInvitationType" NOT NULL,
    status public."SpaceInvitationStatus" DEFAULT 'pending' NOT NULL,
    expires_at timestamptz,
    resolved_at timestamptz,
    max_uses integer,
    uses_count integer DEFAULT 0 NOT NULL,
    created_at timestamptz DEFAULT (now() AT TIME ZONE 'utc') NOT NULL
);

-- Primary key for space invitations
ALTER TABLE public.space_invitations
ADD CONSTRAINT space_invitations_pkey
PRIMARY KEY (id);

-- Ensures invitations target either a user OR a token, never both
ALTER TABLE public.space_invitations
ADD CONSTRAINT space_invitations_target_exclusive
CHECK (
  (user_public_id IS NOT NULL AND token IS NULL)
  OR
  (user_public_id IS NULL AND token IS NOT NULL)
);

-- Enforces structural correctness based on invitation type
ALTER TABLE public.space_invitations
ADD CONSTRAINT space_invitations_type_integrity
CHECK (
  (
    type = 'direct'
    AND user_public_id IS NOT NULL
    AND token IS NULL
    AND max_uses = 1
  )
  OR
  (
    type = 'link'
    AND user_public_id IS NULL
    AND token IS NOT NULL
  )
);

-- Prevents invitations from expiring before creation
ALTER TABLE public.space_invitations
ADD CONSTRAINT space_invitations_valid_expiry
CHECK (
  expires_at IS NULL OR expires_at > created_at
);

-- Ensures usage count never exceeds allowed max uses
ALTER TABLE public.space_invitations
ADD CONSTRAINT space_invitations_usage_limit
CHECK (
  max_uses IS NULL OR uses_count <= max_uses
);

-- Ensures resolved invitations always have a resolution timestamp
ALTER TABLE public.space_invitations
ADD CONSTRAINT space_invitations_resolution_consistency
CHECK (
  status = 'pending' OR resolved_at IS NOT NULL
);

-- Ensures every invitation belongs to a valid space
ALTER TABLE public.space_invitations
ADD CONSTRAINT space_invitations_space_id_fkey
FOREIGN KEY (space_id)
REFERENCES public.spaces(id)
ON UPDATE CASCADE
ON DELETE CASCADE;

-- Ensures invitation creator is a valid user
ALTER TABLE public.space_invitations
ADD CONSTRAINT space_invitations_created_by_fkey
FOREIGN KEY (created_by)
REFERENCES public.users(id)
ON UPDATE CASCADE
ON DELETE RESTRICT;

-- Guarantees global uniqueness of invitation tokens
CREATE UNIQUE INDEX space_invitations_token_unique
ON public.space_invitations (token)
WHERE token IS NOT NULL;

-- Prevents multiple pending direct invitations per user per space
CREATE UNIQUE INDEX space_invitations_unique_pending_direct
ON public.space_invitations (space_id, user_public_id)
WHERE type = 'direct' AND status = 'pending';

------------------------------------------------------------
-- SPACE MEMBERS
------------------------------------------------------------

CREATE TYPE public."SpaceMemberRole" AS ENUM ('owner', 'admin', 'member');
CREATE TYPE public."SpaceMemberStatus" AS ENUM ('active', 'removed');

CREATE TABLE public.space_members (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    space_id uuid NOT NULL,
    user_id uuid NOT NULL,
    role public."SpaceMemberRole" NOT NULL,
    joined_at timestamptz DEFAULT (now() AT TIME ZONE 'utc') NOT NULL,
    invitation_id uuid,
    status public."SpaceMemberStatus" DEFAULT 'active' NOT NULL,
    updated_at timestamptz DEFAULT (now() AT TIME ZONE 'utc') NOT NULL,
    updated_by uuid NOT NULL
);

-- Primary key for space members
ALTER TABLE public.space_members
ADD CONSTRAINT space_members_pkey
PRIMARY KEY (id);

-- Ensures a user has only one active membership per space
CREATE UNIQUE INDEX space_members_unique_active
ON public.space_members (space_id, user_id)
WHERE status = 'active';

-- Ensures membership belongs to a valid space
ALTER TABLE public.space_members
ADD CONSTRAINT space_members_space_id_fkey
FOREIGN KEY (space_id)
REFERENCES public.spaces(id)
ON UPDATE CASCADE
ON DELETE RESTRICT;

-- Ensures membership belongs to a valid user
ALTER TABLE public.space_members
ADD CONSTRAINT space_members_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES public.users(id)
ON UPDATE CASCADE
ON DELETE RESTRICT;

-- Links membership to the invitation that created it
ALTER TABLE public.space_members
ADD CONSTRAINT space_members_invitation_id_fkey
FOREIGN KEY (invitation_id)
REFERENCES public.space_invitations(id)
ON UPDATE CASCADE
ON DELETE RESTRICT;

-- Tracks which user last updated the membership
ALTER TABLE public.space_members
ADD CONSTRAINT space_members_updated_by_fkey
FOREIGN KEY (updated_by)
REFERENCES public.users(id)
ON UPDATE CASCADE
ON DELETE RESTRICT;

------------------------------------------------------------
-- CATEGORIES
------------------------------------------------------------

CREATE TABLE public.categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    space_id uuid NOT NULL,
    user_id uuid NOT NULL,
    title varchar(128) NOT NULL,
    slug varchar(128) NOT NULL,
    created_at timestamptz DEFAULT (now() AT TIME ZONE 'utc') NOT NULL,
    updated_at timestamptz DEFAULT (now() AT TIME ZONE 'utc') NOT NULL
);

-- Primary key for categories
ALTER TABLE public.categories
ADD CONSTRAINT categories_pkey
PRIMARY KEY (id);

-- Prevents duplicate category slugs per space
CREATE UNIQUE INDEX categories_space_slug_unique
ON public.categories (space_id, slug);

-- Ensures category belongs to a valid space
ALTER TABLE public.categories
ADD CONSTRAINT categories_space_id_fkey
FOREIGN KEY (space_id)
REFERENCES public.spaces(id)
ON UPDATE CASCADE
ON DELETE RESTRICT;

-- Tracks user who created the category
ALTER TABLE public.categories
ADD CONSTRAINT categories_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES public.users(id)
ON UPDATE CASCADE
ON DELETE RESTRICT;

------------------------------------------------------------
-- EXPENSES
------------------------------------------------------------

CREATE TABLE public.expenses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    space_id uuid NOT NULL,
    paid_by uuid NOT NULL,
    title varchar(512) NOT NULL,
    date date NOT NULL,
    amount numeric NOT NULL,
    category_id uuid NOT NULL,
    created_at timestamptz DEFAULT (now() AT TIME ZONE 'utc') NOT NULL,
    updated_at timestamptz DEFAULT (now() AT TIME ZONE 'utc') NOT NULL,
    created_by uuid NOT NULL,
    updated_by uuid NOT NULL
);

-- Primary key for expenses
ALTER TABLE public.expenses
ADD CONSTRAINT expenses_pkey
PRIMARY KEY (id);

-- Ensures expense belongs to a valid space
ALTER TABLE public.expenses
ADD CONSTRAINT expenses_space_id_fkey
FOREIGN KEY (space_id)
REFERENCES public.spaces(id)
ON UPDATE CASCADE
ON DELETE RESTRICT;

-- Ensures payer is a valid user
ALTER TABLE public.expenses
ADD CONSTRAINT expenses_paid_by_fkey
FOREIGN KEY (paid_by)
REFERENCES public.users(id)
ON UPDATE CASCADE
ON DELETE RESTRICT;

-- Ensures expense category is valid
ALTER TABLE public.expenses
ADD CONSTRAINT expenses_category_id_fkey
FOREIGN KEY (category_id)
REFERENCES public.categories(id)
ON UPDATE CASCADE
ON DELETE RESTRICT;

-- Tracks which user created the expense
ALTER TABLE public.expenses
ADD CONSTRAINT expenses_created_by_fkey
FOREIGN KEY (created_by)
REFERENCES public.users(id)
ON UPDATE CASCADE
ON DELETE RESTRICT;

-- Tracks which user last updated the expense
ALTER TABLE public.expenses
ADD CONSTRAINT expenses_updated_by_fkey
FOREIGN KEY (updated_by)
REFERENCES public.users(id)
ON UPDATE CASCADE
ON DELETE RESTRICT;

------------------------------------------------------------
-- FEATURES
------------------------------------------------------------

CREATE TYPE public."FeatureScope" AS ENUM ('user', 'space');
CREATE TYPE public."FeatureType" AS ENUM ('boolean', 'numeric', 'text');

CREATE TABLE public.features (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    key varchar(255) NOT NULL,
    scope public."FeatureScope" NOT NULL,
    type public."FeatureType" NOT NULL,
    value varchar(255) NOT NULL,
    price numeric DEFAULT 0,
    currency varchar(3) NOT NULL,
    label varchar(512),
    sort_order smallint,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT (now() AT TIME ZONE 'utc') NOT NULL,
    updated_at timestamptz DEFAULT (now() AT TIME ZONE 'utc') NOT NULL
);

-- Primary key for features
ALTER TABLE public.features
ADD CONSTRAINT features_pkey
PRIMARY KEY (id);

-- Optimizes feature lookup by key and scope
CREATE INDEX features_key_scope_idx
ON public.features (key, scope);

------------------------------------------------------------
-- USER FEATURES
------------------------------------------------------------

CREATE TABLE public.user_features (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    feature_id uuid NOT NULL,
    expires_at timestamptz,
    created_at timestamptz DEFAULT (now() AT TIME ZONE 'utc') NOT NULL,
    updated_at timestamptz DEFAULT (now() AT TIME ZONE 'utc') NOT NULL
);

-- Primary key for user feature assignments
ALTER TABLE public.user_features
ADD CONSTRAINT user_features_pkey
PRIMARY KEY (id);

-- Optimizes lookup of features by user
CREATE INDEX user_features_user_id_idx
ON public.user_features (user_id);

-- Ensures user feature belongs to a valid user
ALTER TABLE public.user_features
ADD CONSTRAINT user_features_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES public.users(id)
ON UPDATE CASCADE
ON DELETE CASCADE;

-- Ensures referenced feature exists
ALTER TABLE public.user_features
ADD CONSTRAINT user_features_feature_id_fkey
FOREIGN KEY (feature_id)
REFERENCES public.features(id)
ON UPDATE CASCADE
ON DELETE CASCADE;

------------------------------------------------------------
-- SPACE FEATURES
------------------------------------------------------------

CREATE TABLE public.space_features (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    space_id uuid NOT NULL,
    feature_id uuid NOT NULL,
    expires_at timestamptz,
    created_at timestamptz DEFAULT (now() AT TIME ZONE 'utc') NOT NULL,
    updated_at timestamptz DEFAULT (now() AT TIME ZONE 'utc') NOT NULL
);

-- Primary key for space feature assignments
ALTER TABLE public.space_features
ADD CONSTRAINT space_features_pkey
PRIMARY KEY (id);

-- Optimizes lookup of features by space
CREATE INDEX space_features_space_id_idx
ON public.space_features (space_id);

-- Ensures space feature belongs to a valid space
ALTER TABLE public.space_features
ADD CONSTRAINT space_features_space_id_fkey
FOREIGN KEY (space_id)
REFERENCES public.spaces(id)
ON UPDATE CASCADE
ON DELETE CASCADE;

-- Ensures referenced feature exists
ALTER TABLE public.space_features
ADD CONSTRAINT space_features_feature_id_fkey
FOREIGN KEY (feature_id)
REFERENCES public.features(id)
ON UPDATE CASCADE
ON DELETE CASCADE;

COMMIT;
