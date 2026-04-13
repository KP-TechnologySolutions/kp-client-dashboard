-- ============================================
-- KP Client Dashboard — Initial Schema
-- ============================================

-- Organizations (client businesses)
CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  website_url text,
  primary_contact_name text,
  primary_contact_email text,
  primary_contact_phone text,
  notes text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin', 'client')),
  organization_id uuid REFERENCES organizations(id),
  full_name text NOT NULL,
  email text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Requests (core entity)
CREATE TABLE requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_number serial,
  organization_id uuid NOT NULL REFERENCES organizations(id),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('menu_update', 'content_change', 'feature_request', 'bug_fix', 'design_change', 'other')),
  priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status text NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewed', 'in_progress', 'complete', 'rejected')),
  submitted_by uuid NOT NULL REFERENCES profiles(id),
  assigned_to text,
  due_date date,
  completed_at timestamptz,
  completed_by text,
  estimated_minutes integer,
  actual_minutes integer,
  internal_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Request attachments
CREATE TABLE request_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  file_name text NOT NULL,
  file_size_kb integer,
  mime_type text,
  uploaded_by uuid NOT NULL REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Request comments
CREATE TABLE request_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES profiles(id),
  body text NOT NULL,
  is_internal boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Activity log
CREATE TABLE activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  actor_id uuid NOT NULL REFERENCES profiles(id),
  action text NOT NULL CHECK (action IN ('created', 'status_changed', 'assigned', 'commented', 'priority_changed')),
  old_value text,
  new_value text,
  created_at timestamptz DEFAULT now()
);

-- Auto-update updated_at on requests
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER requests_updated_at
  BEFORE UPDATE ON requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, role, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'client'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Indexes
CREATE INDEX idx_requests_org ON requests(organization_id);
CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_requests_submitted_by ON requests(submitted_by);
CREATE INDEX idx_comments_request ON request_comments(request_id);
CREATE INDEX idx_activity_request ON activity_log(request_id);
