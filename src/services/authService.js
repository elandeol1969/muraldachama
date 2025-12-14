import { supabase } from './supabaseClient'

// Cadastrar novo usuário
export const cadastrarUsuario = async (nome, email, senha) => {
  try {
    // Verifica se o email já existe
    const { data: existingUser } = await supabase
      .from('user_message')
      .select('email_usuario')
      .eq('email_usuario', email)
      .single()

    if (existingUser) {
      return { error: 'Email já cadastrado' }
    }

    // Insere novo usuário
    const { data, error } = await supabase
      .from('user_message')
      .insert([
        {
          nome_usuario: nome,
          email_usuario: email,
          senha_usuario: senha, // Em produção, use hash de senha
          imagem_usuario: null,
          imagem_message: null
        }
      ])
      .select()
      .single()

    return { data, error }
  } catch (error) {
    return { error: error.message }
  }
}

// Login de usuário
export const loginUsuario = async (email, senha) => {
  try {
    const { data, error } = await supabase
      .from('user_message')
      .select('*')
      .eq('email_usuario', email)
      .eq('senha_usuario', senha)
      .single()

    if (error || !data) {
      return { error: 'Email ou senha inválidos' }
    }

    // Salva sessão no localStorage
    localStorage.setItem('user', JSON.stringify(data))
    return { data, error: null }
  } catch (error) {
    return { error: error.message }
  }
}

// Logout
export const logoutUsuario = () => {
  localStorage.removeItem('user')
}

// Obter usuário logado
export const getUsuarioLogado = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

// Atualizar dados do usuário
export const atualizarUsuario = async (id, dados) => {
  try {
    const { data, error } = await supabase
      .from('user_message')
      .update(dados)
      .eq('id', id)
      .select()
      .single()

    if (!error && data) {
      localStorage.setItem('user', JSON.stringify(data))
    }

    return { data, error }
  } catch (error) {
    return { error: error.message }
  }
}

// Upload de imagem
export const uploadImagem = async (file, tipo = 'usuario') => {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${tipo}/${fileName}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Erro no upload:', uploadError)
      // Fallback para base64
      return { data: await fileToBase64(file), error: null }
    }

    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    return { data: data.publicUrl, error: null }
  } catch (error) {
    console.error('Erro ao fazer upload:', error)
    // Fallback para base64
    return { data: await fileToBase64(file), error: null }
  }
}

// Converte file para base64 (fallback)
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}
