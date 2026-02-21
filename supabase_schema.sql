-- Supabase Schema for FizyoPoz

-- Create profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users not null primary key,
  role text check (role in ('patient', 'physio')) default 'patient',
  physio_id uuid references public.profiles(id) default null,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

-- Profile Policies
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);
create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create workout logs table
create table public.workout_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  exercise_type text not null, -- 'Squat', 'Bicep Curl', etc.
  sets integer default 0,
  reps integer default 0,
  max_angle numeric, 
  accuracy_score numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for workout_logs
alter table public.workout_logs enable row level security;

-- Workout Logs Policies
create policy "Patients can view their own workout logs" on workout_logs
  for select using (auth.uid() = user_id);

create policy "Patients can insert their own workout logs" on workout_logs
  for insert with check (auth.uid() = user_id);

create policy "Physios can view their patients' workout logs" on workout_logs
  for select using (
    exists (
      select 1 from public.profiles
      where profiles.id = workout_logs.user_id
        and profiles.physio_id = auth.uid()
    )
  );

-- Create function to handle new user signups
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', coalesce(new.raw_user_meta_data->>'role', 'patient'));
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
