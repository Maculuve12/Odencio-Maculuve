// ============================================================
// Configuração do Supabase — usado por todas as páginas do site
// ============================================================
// Este ficheiro carrega a biblioteca do Supabase e cria uma
// ligação única (window.supabaseClient) que todas as páginas
// (index.html, sobre.html, contactos.html, projetos.html,
// publicacoes.html, admin.html) podem usar.

const SUPABASE_URL = "https://hjvxnitlxktfcvgohxkm.supabase.co";
const SUPABASE_KEY = "sb_publishable_-cVvyWq4CYkHOabUMU2yXQ_tRS0fuyQ";

// Cria o cliente assim que a biblioteca (carregada via CDN no HTML) estiver disponível
window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
