import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function saveProject(projectName, wpdData, thumbnail = '') {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User must be authenticated to save projects');
  }

  const { data, error } = await supabase
    .from('projects')
    .insert({
      user_id: user.id,
      name: projectName,
      wpd_data: wpdData,
      thumbnail: thumbnail,
      updated_at: new Date().toISOString()
    })
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateProject(projectId, projectName, wpdData, thumbnail = '') {
  const { data, error } = await supabase
    .from('projects')
    .update({
      name: projectName,
      wpd_data: wpdData,
      thumbnail: thumbnail,
      updated_at: new Date().toISOString()
    })
    .eq('id', projectId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getProject(projectId) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function deleteProject(projectId) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId);

  if (error) throw error;
}
