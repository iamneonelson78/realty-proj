-- ============================================================
-- SEED: Default Admin User
-- Run this in the Supabase SQL Editor AFTER running schema.sql
-- pgcrypto extension is required (already enabled in schema.sql)
-- ============================================================

do $$
declare
  v_user_id uuid := gen_random_uuid();
  v_email    text := 'admin@rentcrm.com';
  v_password text := 'Admin@12345';
begin

  -- Only insert if the user doesn't already exist
  if not exists (select 1 from auth.users where email = v_email) then

    insert into auth.users (
      id,
      instance_id,
      role,
      aud,
      email,
      encrypted_password,
      email_confirmed_at,
      confirmation_sent_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      is_super_admin
    ) values (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      v_email,
      crypt(v_password, gen_salt('bf')),
      now(),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Admin"}',
      now(),
      now(),
      false
    );

    -- Required: insert identity record so GoTrue can authenticate via email/password
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
      jsonb_build_object('sub', v_user_id::text, 'email', v_email),
      'email',
      now(),
      now(),
      now()
    );

    -- Profile is normally created by the trigger, but insert explicitly as fallback
    insert into public.profiles (id, email, full_name)
    values (v_user_id, v_email, 'Admin')
    on conflict (id) do nothing;

    raise notice 'Admin user created: %', v_email;
  else
    raise notice 'Admin user already exists: %', v_email;
  end if;

end $$;
