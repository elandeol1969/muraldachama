import { supabase } from './supabaseClient'

// Buscar últimas 24 mensagens (uma por usuário)
export const buscarMensagens = async () => {
  try {
    // Busca todas as mensagens ordenadas por data
    const { data, error } = await supabase
      .from('user_message')
      .select('*')
      .not('imagem_message', 'is', null)
      .order('created_at', { ascending: false })

    if (error) return { data: [], error }

    // Filtra para manter apenas a última mensagem de cada usuário
    const mensagensUnicas = []
    const emailsVistos = new Set()

    for (const msg of data) {
      if (!emailsVistos.has(msg.email_usuario) && msg.imagem_message) {
        mensagensUnicas.push(msg)
        emailsVistos.add(msg.email_usuario)
      }
      if (mensagensUnicas.length >= 24) break
    }

    return { data: mensagensUnicas, error: null }
  } catch (error) {
    return { data: [], error: error.message }
  }
}

// Criar ou atualizar mensagem do usuário
export const salvarMensagem = async (userId, mensagem) => {
  try {
    // Verifica se já existe uma mensagem para este usuário
    const { data: existing } = await supabase
      .from('user_message')
      .select('id')
      .eq('id', userId)
      .single()

    const { data, error } = await supabase
      .from('user_message')
      .update({
        imagem_message: mensagem.imagem,
        mensagem: mensagem.mensagem,
        nome_usuario: mensagem.nome || existing?.nome_usuario
      })
      .eq('id', userId)
      .select()
      .single()

    return { data, error }
  } catch (error) {
    return { error: error.message }
  }
}

// Deletar mensagem do usuário
export const deletarMensagem = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_message')
      .update({
        imagem_message: null
      })
      .eq('id', userId)
      .select()
      .single()

    return { data, error }
  } catch (error) {
    return { error: error.message }
  }
}

// Upload de imagem de mensagem
export const uploadImagemMensagem = async (file) => {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `mensagens/${fileName}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Erro no upload da mensagem:', uploadError)
      // Fallback para base64
      return { data: await fileToBase64(file), error: null }
    }

    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    return { data: data.publicUrl, error: null }
  } catch (error) {
    console.error('Erro ao fazer upload da mensagem:', error)
    // Fallback para base64
    return { data: await fileToBase64(file), error: null }
  }
}

// Converte file para base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}
