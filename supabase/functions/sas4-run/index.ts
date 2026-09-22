import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const authorization = request.headers.get('Authorization');
  if (!authorization) return json({ error: 'Authentication required' }, 401);

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const n8nWebhookUrl = Deno.env.get('SAS4_N8N_WEBHOOK_URL');
  if (!supabaseUrl || !supabaseAnonKey || !n8nWebhookUrl) {
    return json({ error: 'SAS4 integration is not configured' }, 503);
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authorization } },
  });
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return json({ error: 'Invalid session' }, 401);

  const roles = [user.app_metadata?.role, user.user_metadata?.role];
  if (!roles.includes('manager') && !roles.includes('admin')) {
    return json({ error: 'Manager access required' }, 403);
  }

  let input: Record<string, unknown>;
  try {
    input = await request.json();
  } catch {
    return json({ error: 'Request body must be valid JSON' }, 400);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  try {
    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'mind2mind-manager',
        workflow: 'SAS4 API Connector',
        requested_by: user.id,
        ...input,
      }),
      signal: controller.signal,
    });
    const responseText = await n8nResponse.text();
    if (!n8nResponse.ok) return json({ error: 'SAS4 workflow rejected the request', status: n8nResponse.status }, 502);
    return json({ ok: true, result: responseText.slice(0, 2000) });
  } catch (error) {
    const message = error instanceof Error && error.name === 'AbortError' ? 'SAS4 workflow timed out' : 'SAS4 workflow is unreachable';
    return json({ error: message }, 502);
  } finally {
    clearTimeout(timeout);
  }
});
