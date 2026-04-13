-- ============================================
-- Row Level Security Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Helper: check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper: get current user's organization
CREATE OR REPLACE FUNCTION user_org_id()
RETURNS uuid AS $$
  SELECT organization_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- ── Organizations ──
CREATE POLICY "Admins see all orgs"
  ON organizations FOR SELECT
  USING (is_admin());

CREATE POLICY "Clients see own org"
  ON organizations FOR SELECT
  USING (id = user_org_id());

CREATE POLICY "Admins manage orgs"
  ON organizations FOR ALL
  USING (is_admin());

-- ── Profiles ──
CREATE POLICY "Users see own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Admins see all profiles"
  ON profiles FOR SELECT
  USING (is_admin());

CREATE POLICY "Users update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

-- ── Requests ──
CREATE POLICY "Admins see all requests"
  ON requests FOR SELECT
  USING (is_admin());

CREATE POLICY "Clients see own org requests"
  ON requests FOR SELECT
  USING (organization_id = user_org_id());

CREATE POLICY "Clients create requests for own org"
  ON requests FOR INSERT
  WITH CHECK (organization_id = user_org_id() AND submitted_by = auth.uid());

CREATE POLICY "Admins manage all requests"
  ON requests FOR ALL
  USING (is_admin());

-- ── Request Comments ──
CREATE POLICY "Admins see all comments"
  ON request_comments FOR SELECT
  USING (is_admin());

CREATE POLICY "Clients see non-internal comments on own org requests"
  ON request_comments FOR SELECT
  USING (
    is_internal = false
    AND EXISTS (
      SELECT 1 FROM requests r
      WHERE r.id = request_id AND r.organization_id = user_org_id()
    )
  );

CREATE POLICY "Admins create comments"
  ON request_comments FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Clients create comments on own org requests"
  ON request_comments FOR INSERT
  WITH CHECK (
    is_internal = false
    AND author_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM requests r
      WHERE r.id = request_id AND r.organization_id = user_org_id()
    )
  );

-- ── Activity Log ──
CREATE POLICY "Admins see all activity"
  ON activity_log FOR SELECT
  USING (is_admin());

CREATE POLICY "Clients see activity on own org requests"
  ON activity_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM requests r
      WHERE r.id = request_id AND r.organization_id = user_org_id()
    )
  );

CREATE POLICY "Admins create activity"
  ON activity_log FOR INSERT
  WITH CHECK (is_admin());

-- ── Request Attachments ──
CREATE POLICY "Admins see all attachments"
  ON request_attachments FOR SELECT
  USING (is_admin());

CREATE POLICY "Clients see attachments on own org requests"
  ON request_attachments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM requests r
      WHERE r.id = request_id AND r.organization_id = user_org_id()
    )
  );

CREATE POLICY "Users upload attachments"
  ON request_attachments FOR INSERT
  WITH CHECK (uploaded_by = auth.uid());
