-- ============================================================
-- SEED: Default Admin User
-- Email:    admin@rentcrm.com
-- Password: Admin@12345
--
-- BEFORE running: delete any previous broken attempt:
--   delete from auth.users where email = 'admin@rentcrm.com';
--
-- Run AFTER schema.sql in Supabase SQL Editor.
-- ============================================================

do $$
declare
  v_user_id uuid := gen_random_uuid();
  v_email    text := 'admin@rentcrm.com';
  v_password text := 'Admin@12345';
begin

  if not exists (select 1 from auth.users where email = v_email) then

    -- 1. Create the auth user
    insert into auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) values (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      v_email,
      crypt(v_password, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Admin"}',
      false,
      now(),
      now(),
      '',
      '',
      '',
      ''
    );

    -- 2. Create the identity record (required for GoTrue email/password login)
    insert into auth.identities (
      id,
      user_id,
      provider_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    ) values (
      v_user_id,
      v_user_id,
      v_email,
      jsonb_build_object(
        'sub',            v_user_id::text,
        'email',          v_email,
        'email_verified', true,
        'phone_verified', false
      ),
      'email',
      now(),
      now(),
      now()
    );

    -- 3. Create the public profile
    insert into public.profiles (id, email, full_name)
    values (v_user_id, v_email, 'Admin')
    on conflict (id) do nothing;

    raise notice 'Admin user created: %', v_email;
  else
    raise notice 'Admin user already exists: %', v_email;
  end if;

end $$;
