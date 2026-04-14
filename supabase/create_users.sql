-- Confirm Izzy
UPDATE auth.users SET email_confirmed_at = now() WHERE email = 'izzy@56kitchen.com';

-- Heather Dunbar
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, aud, role, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'heather@56kitchen.com',
  crypt('Money22$$', gen_salt('bf')), now(), 'authenticated', 'authenticated',
  '{"role":"client","full_name":"Heather Dunbar"}'::jsonb, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'heather@56kitchen.com');

INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, created_at, updated_at)
SELECT gen_random_uuid(), id, jsonb_build_object('sub', id::text, 'email', email), 'email', id::text, now(), now()
FROM auth.users WHERE email = 'heather@56kitchen.com' AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider_id = (SELECT id::text FROM auth.users WHERE email = 'heather@56kitchen.com'));

-- Stelluti Plumbing
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, aud, role, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'stellutiplumbing@aol.com',
  crypt('Money22$$', gen_salt('bf')), now(), 'authenticated', 'authenticated',
  '{"role":"client","full_name":"Stelluti Plumbing"}'::jsonb, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'stellutiplumbing@aol.com');

INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, created_at, updated_at)
SELECT gen_random_uuid(), id, jsonb_build_object('sub', id::text, 'email', email), 'email', id::text, now(), now()
FROM auth.users WHERE email = 'stellutiplumbing@aol.com' AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider_id = (SELECT id::text FROM auth.users WHERE email = 'stellutiplumbing@aol.com'));

-- Brian Callahan
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, aud, role, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'callahanplumbingandheating@gmail.com',
  crypt('Money22$$', gen_salt('bf')), now(), 'authenticated', 'authenticated',
  '{"role":"client","full_name":"Brian Callahan"}'::jsonb, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'callahanplumbingandheating@gmail.com');

INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, created_at, updated_at)
SELECT gen_random_uuid(), id, jsonb_build_object('sub', id::text, 'email', email), 'email', id::text, now(), now()
FROM auth.users WHERE email = 'callahanplumbingandheating@gmail.com' AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider_id = (SELECT id::text FROM auth.users WHERE email = 'callahanplumbingandheating@gmail.com'));

-- Kara
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, aud, role, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'kara@kmpclarity.com',
  crypt('Money22$$', gen_salt('bf')), now(), 'authenticated', 'authenticated',
  '{"role":"client","full_name":"Kara"}'::jsonb, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'kara@kmpclarity.com');

INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, created_at, updated_at)
SELECT gen_random_uuid(), id, jsonb_build_object('sub', id::text, 'email', email), 'email', id::text, now(), now()
FROM auth.users WHERE email = 'kara@kmpclarity.com' AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider_id = (SELECT id::text FROM auth.users WHERE email = 'kara@kmpclarity.com'));

-- Impact Care HR
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, aud, role, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'info@impactcarehr.com',
  crypt('Money22$$', gen_salt('bf')), now(), 'authenticated', 'authenticated',
  '{"role":"client","full_name":"Impact Care HR"}'::jsonb, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'info@impactcarehr.com');

INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, created_at, updated_at)
SELECT gen_random_uuid(), id, jsonb_build_object('sub', id::text, 'email', email), 'email', id::text, now(), now()
FROM auth.users WHERE email = 'info@impactcarehr.com' AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider_id = (SELECT id::text FROM auth.users WHERE email = 'info@impactcarehr.com'));

-- People Express
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, aud, role, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'peoplereservations@gmail.com',
  crypt('Money22$$', gen_salt('bf')), now(), 'authenticated', 'authenticated',
  '{"role":"client","full_name":"People Express"}'::jsonb, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'peoplereservations@gmail.com');

INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, created_at, updated_at)
SELECT gen_random_uuid(), id, jsonb_build_object('sub', id::text, 'email', email), 'email', id::text, now(), now()
FROM auth.users WHERE email = 'peoplereservations@gmail.com' AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider_id = (SELECT id::text FROM auth.users WHERE email = 'peoplereservations@gmail.com'));
