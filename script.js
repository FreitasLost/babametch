// Configuração da API
const API_BASE_URL = "api" // Altere para o caminho correto da sua API

// Estado da aplicação
let currentUser = null
let babysitters = []
let currentBabysitterIndex = 0
let matches = []
let currentChatId = null
let messages = {}

// Funções de utilidade
function showLoading() {
  document.getElementById("loading-overlay").style.display = "flex"
}

function hideLoading() {
  document.getElementById("loading-overlay").style.display = "none"
}

// Funções de autenticação
function showLogin() {
  document.getElementById("login-form").classList.add("active")
  document.getElementById("register-form").classList.remove("active")
}

function showRegister() {
  document.getElementById("register-form").classList.add("active")
  document.getElementById("login-form").classList.remove("active")
}

async function handleLogin(event) {
  event.preventDefault()

  const email = document.getElementById("login-email").value
  const password = document.getElementById("login-password").value
  const errorElement = document.getElementById("login-error")
  const loginButton = document.getElementById("login-button")

  // Validação básica
  if (!email || !password) {
    errorElement.textContent = "Preencha todos os campos"
    return
  }

  try {
    loginButton.disabled = true
    showLoading()

    const response = await fetch(`${API_BASE_URL}/login.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, senha: password }),
    })

    const data = await response.json()

    if (data.success) {
      currentUser = data.user
      localStorage.setItem("currentUser", JSON.stringify(currentUser))
      await loadBabysitters()
      showMainScreen()
    } else {
      errorElement.textContent = data.message || "Erro ao fazer login"
    }
  } catch (error) {
    console.error("Erro ao fazer login:", error)
    errorElement.textContent = "Erro ao conectar ao servidor"
  } finally {
    loginButton.disabled = false
    hideLoading()
  }
}

async function handleRegister(event) {
  event.preventDefault()

  const name = document.getElementById("register-name").value
  const email = document.getElementById("register-email").value
  const password = document.getElementById("register-password").value
  const phone = document.getElementById("register-phone").value
  const userType = document.querySelector('input[name="userType"]:checked').value
  const errorElement = document.getElementById("register-error")
  const registerButton = document.getElementById("register-button")

  // Validação básica
  if (!name || !email || !password) {
    errorElement.textContent = "Preencha todos os campos obrigatórios"
    return
  }

  const registerData = {
    nome: name,
    email,
    senha: password,
    telefone: phone,
    tipo: userType,
  }

  // Adicionar campos específicos
  if (userType === "babysitter") {
    registerData.idade = document.getElementById("register-age").value
    registerData.valor_hora = document.getElementById("register-hourly-rate").value
    registerData.experiencia = document.getElementById("register-experience").value
    registerData.localizacao = document.getElementById("register-location").value
    registerData.bio = document.getElementById("register-bio").value

    const skillsText = document.getElementById("register-skills").value
    registerData.habilidades = skillsText ? skillsText.split(",").map((s) => s.trim()) : []
  } else {
    registerData.num_criancas = document.getElementById("register-num-children").value
    registerData.idades_criancas = document.getElementById("register-children-ages").value
  }

  try {
    registerButton.disabled = true
    showLoading()

    const response = await fetch(`${API_BASE_URL}/register.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerData),
    })

    const data = await response.json()

    if (data.success) {
      currentUser = data.user
      localStorage.setItem("currentUser", JSON.stringify(currentUser))

      if (userType === "babysitter") {
        alert("Cadastro realizado! Seu perfil será validado em breve para aparecer no feed.")
      }

      await loadBabysitters()
      showMainScreen()
    } else {
      errorElement.textContent = data.message || "Erro ao cadastrar"
    }
  } catch (error) {
    console.error("Erro ao cadastrar:", error)
    errorElement.textContent = "Erro ao conectar ao servidor"
  } finally {
    registerButton.disabled = false
    hideLoading()
  }
}

function logout() {
  localStorage.removeItem("currentUser")
  currentUser = null
  currentBabysitterIndex = 0
  babysitters = []
  matches = []
  currentChatId = null
  messages = {}

  document.getElementById("auth-screen").classList.add("active")
  document.getElementById("main-screen").classList.remove("active")
  document.getElementById("chat-screen").classList.remove("active")
  document.getElementById("profile-screen").classList.remove("active")

  // Limpar formulários
  document.getElementById("login-email").value = ""
  document.getElementById("login-password").value = ""
  document.getElementById("register-name").value = ""
  document.getElementById("register-email").value = ""
  document.getElementById("register-password").value = ""
  document.getElementById("login-error").textContent = ""
  document.getElementById("register-error").textContent = ""
}

// Funções de navegação
function showMainScreen() {
  document.getElementById("auth-screen").classList.remove("active")
  document.getElementById("main-screen").classList.add("active")
  document.getElementById("chat-screen").classList.remove("active")
  document.getElementById("profile-screen").classList.remove("active")

  loadCurrentBabysitter()
  updateMatchesCount()
}

function showChat() {
  document.getElementById("auth-screen").classList.remove("active")
  document.getElementById("main-screen").classList.remove("active")
  document.getElementById("chat-screen").classList.add("active")
  document.getElementById("profile-screen").classList.remove("active")

  loadMatches()
}

function showMain() {
  showMainScreen()
}

// Funções de carregamento de dados
async function loadBabysitters() {
  try {
    showLoading()

    const response = await fetch(`${API_BASE_URL}/get_babysitters.php`)
    const data = await response.json()

    if (data.success) {
      babysitters = data.babysitters
      currentBabysitterIndex = 0
    } else {
      console.error("Erro ao carregar babás:", data.message)
      babysitters = []
    }
  } catch (error) {
    console.error("Erro ao carregar babás:", error)
    babysitters = []
  } finally {
    hideLoading()
  }
}

async function loadMatches() {
  if (!currentUser) return

  try {
    showLoading()

    const response = await fetch(
      `${API_BASE_URL}/get_matches.php?user_id=${currentUser.id}&user_type=${currentUser.tipo}`,
    )
    const data = await response.json()

    if (data.success) {
      matches = data.matches
      updateMatchesCount()
      displayMatches()
    } else {
      console.error("Erro ao carregar matches:", data.message)
      matches = []
      displayMatches()
    }
  } catch (error) {
    console.error("Erro ao carregar matches:", error)
    matches = []
    displayMatches()
  } finally {
    hideLoading()
  }
}

// Funções do swipe
function loadCurrentBabysitter() {
  const card = document.getElementById("babysitter-card")
  const noMoreCards = document.getElementById("no-more-cards")

  if (currentBabysitterIndex >= babysitters.length) {
    card.style.display = "none"
    noMoreCards.style.display = "block"
    document.getElementById("final-matches-count").textContent = matches.length
    return
  }

  const babysitter = babysitters[currentBabysitterIndex]

  card.innerHTML = `
        <div class="card-image">
            <i class="fas fa-user"></i>
            <div class="card-overlay">
                <h3>${babysitter.nome}, ${babysitter.idade}</h3>
                <div class="location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${babysitter.localizacao || "Localização não informada"}</span>
                    <span>•</span>
                    <span>${babysitter.experiencia || "Experiência não informada"}</span>
                </div>
            </div>
        </div>
        <div class="card-content">
            <div class="card-rate">${babysitter.hourlyRate || "Valor não informado"}</div>
            <div class="card-bio">${babysitter.bio || "Sem descrição"}</div>
            <div class="skills">
                ${(babysitter.skills || []).map((skill) => `<span class="skill-tag">${skill}</span>`).join("")}
            </div>
        </div>
    `

  card.style.display = "block"
  noMoreCards.style.display = "none"
}

async function swipeLeft() {
  if (currentBabysitterIndex >= babysitters.length) return

  const card = document.getElementById("babysitter-card")
  card.classList.add("swipe-left")

  setTimeout(() => {
    card.classList.remove("swipe-left")
    currentBabysitterIndex++
    loadCurrentBabysitter()
  }, 300)
}

async function swipeRight() {
  if (currentBabysitterIndex >= babysitters.length || !currentUser) return

  const card = document.getElementById("babysitter-card")
  card.classList.add("swipe-right")

  const babysitter = babysitters[currentBabysitterIndex]

  try {
    // Adicionar match no banco de dados
    const response = await fetch(`${API_BASE_URL}/add_match.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pai_id: currentUser.id,
        baba_id: babysitter.id,
      }),
    })

    const data = await response.json()

    if (data.success) {
      // Adicionar aos matches locais
      matches.push(babysitter)
      updateMatchesCount()
    } else {
      console.error("Erro ao adicionar match:", data.message)
    }
  } catch (error) {
    console.error("Erro ao adicionar match:", error)
  }

  setTimeout(() => {
    card.classList.remove("swipe-right")
    currentBabysitterIndex++
    loadCurrentBabysitter()
  }, 300)
}

function updateMatchesCount() {
  document.getElementById("matches-count").textContent = matches.length
  document.getElementById("final-matches-count").textContent = matches.length
}

// Funções do chat
function displayMatches() {
  const container = document.getElementById("matches-container")

  if (matches.length === 0) {
    container.innerHTML = '<p class="no-matches">Você ainda não tem matches</p>'
    return
  }

  container.innerHTML = matches
    .map(
      (match) => `
            <div class="match-item" onclick="openChat(${match.id})">
                <div class="match-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="match-info">
                    <h4>${match.nome}</h4>
                    <p>${match.localizacao || "Localização não informada"}</p>
                </div>
            </div>
        `,
    )
    .join("")
}

async function openChat(babysitterId) {
  if (!currentUser) return

  currentChatId = babysitterId
  const babysitter = matches.find((m) => m.id == babysitterId)

  if (!babysitter) return

  // Atualizar header do chat
  document.getElementById("chat-name").textContent = babysitter.nome
  document.getElementById("chat-rate").textContent = babysitter.hourlyRate || "Valor não informado"

  // Mostrar área de chat
  document.getElementById("chat-area").style.display = "flex"

  // Marcar como ativo
  document.querySelectorAll(".match-item").forEach((item) => {
    item.classList.remove("active")
  })
  event.target.closest(".match-item").classList.add("active")

  // Carregar mensagens
  await loadMessages(babysitterId)
}

async function loadMessages(babysitterId) {
  if (!currentUser) return

  try {
    showLoading()

    const response = await fetch(`${API_BASE_URL}/get_messages.php?user1_id=${currentUser.id}&user2_id=${babysitterId}`)
    const data = await response.json()

    if (data.success) {
      messages[babysitterId] = data.messages
      displayMessages(babysitterId)
    } else {
      console.error("Erro ao carregar mensagens:", data.message)
      messages[babysitterId] = []
      displayMessages(babysitterId)
    }
  } catch (error) {
    console.error("Erro ao carregar mensagens:", error)
    messages[babysitterId] = []
    displayMessages(babysitterId)
  } finally {
    hideLoading()
  }
}

function displayMessages(babysitterId) {
  const container = document.getElementById("messages-container")

  if (!messages[babysitterId] || messages[babysitterId].length === 0) {
    container.innerHTML =
      '<p class="no-messages" style="text-align: center; color: #666; padding: 2rem;">Nenhuma mensagem ainda. Diga olá!</p>'
    return
  }

  container.innerHTML = messages[babysitterId]
    .map(
      (message) => `
            <div class="message ${message.remetente_id == currentUser.id ? "sent" : "received"}">
                <div>${message.mensagem}</div>
                <div class="message-time">${message.hora}</div>
            </div>
        `,
    )
    .join("")

  container.scrollTop = container.scrollHeight
}

async function sendMessage() {
  if (!currentUser || !currentChatId) return

  const input = document.getElementById("message-input")
  const text = input.value.trim()

  if (!text) return

  try {
    const response = await fetch(`${API_BASE_URL}/send_message.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        remetente_id: currentUser.id,
        destinatario_id: currentChatId,
        mensagem: text,
      }),
    })

    const data = await response.json()

    if (data.success) {
      // Limpar input
      input.value = ""

      // Recarregar mensagens
      await loadMessages(currentChatId)
    } else {
      console.error("Erro ao enviar mensagem:", data.message)
      alert("Erro ao enviar mensagem. Tente novamente.")
    }
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error)
    alert("Erro ao conectar ao servidor. Tente novamente.")
  }
}

// Funções de perfil
function showProfile() {
  document.getElementById("auth-screen").classList.remove("active")
  document.getElementById("main-screen").classList.remove("active")
  document.getElementById("chat-screen").classList.remove("active")
  document.getElementById("profile-screen").classList.add("active")

  loadProfile()
}

async function loadProfile() {
  if (!currentUser) return

  try {
    showLoading()

    const response = await fetch(`${API_BASE_URL}/get_profile.php?user_id=${currentUser.id}`)
    const data = await response.json()

    if (data.success) {
      const profile = data.profile

      // Preencher campos básicos
      document.getElementById("profile-name").value = profile.nome || ""
      document.getElementById("profile-email").value = profile.email || ""
      document.getElementById("profile-phone").value = profile.telefone || ""
      document.getElementById("profile-address").value = profile.endereco || ""

      // Atualizar foto
      const photoElement = document.getElementById("profile-photo")
      if (profile.foto) {
        photoElement.innerHTML = `<img src="${profile.foto}" alt="Foto do perfil">`
      } else {
        photoElement.innerHTML = '<i class="fas fa-user"></i>'
      }

      // Mostrar seção específica do tipo de usuário
      if (profile.tipo === "babysitter") {
        document.getElementById("babysitter-section").style.display = "block"
        document.getElementById("parent-section").style.display = "none"

        // Preencher campos de babá
        document.getElementById("profile-age").value = profile.idade || ""
        document.getElementById("profile-hourly-rate").value = profile.valor_hora || ""
        document.getElementById("profile-experience").value = profile.experiencia || ""
        document.getElementById("profile-location").value = profile.localizacao || ""
        document.getElementById("profile-bio").value = profile.bio || ""
        document.getElementById("profile-skills").value = (profile.habilidades || []).join(", ")

        // Status de validação
        const validationStatus = document.getElementById("validation-status")
        if (profile.validado) {
          validationStatus.className = "validation-status validated"
          validationStatus.innerHTML = '<i class="fas fa-check-circle"></i><span>Perfil validado</span>'
        } else {
          validationStatus.className = "validation-status"
          validationStatus.innerHTML = '<i class="fas fa-clock"></i><span>Aguardando validação</span>'
        }
      } else {
        document.getElementById("babysitter-section").style.display = "none"
        document.getElementById("parent-section").style.display = "block"

        // Preencher campos de pai/mãe
        document.getElementById("profile-num-children").value = profile.num_criancas || ""
        document.getElementById("profile-children-ages").value = profile.idades_criancas || ""
        document.getElementById("profile-special-needs").value = profile.necessidades_especiais || ""
      }
    } else {
      showProfileMessage("Erro ao carregar perfil", "error")
    }
  } catch (error) {
    console.error("Erro ao carregar perfil:", error)
    showProfileMessage("Erro ao conectar ao servidor", "error")
  } finally {
    hideLoading()
  }
}

async function saveProfile() {
  if (!currentUser) return

  const saveButton = document.getElementById("save-profile-btn")

  try {
    saveButton.disabled = true
    showLoading()

    const profileData = {
      user_id: currentUser.id,
      nome: document.getElementById("profile-name").value,
      telefone: document.getElementById("profile-phone").value,
      endereco: document.getElementById("profile-address").value,
    }

    if (currentUser.tipo === "babysitter") {
      profileData.idade = document.getElementById("profile-age").value
      profileData.valor_hora = document.getElementById("profile-hourly-rate").value
      profileData.experiencia = document.getElementById("profile-experience").value
      profileData.localizacao = document.getElementById("profile-location").value
      profileData.bio = document.getElementById("profile-bio").value

      const skillsText = document.getElementById("profile-skills").value
      profileData.habilidades = skillsText ? skillsText.split(",").map((s) => s.trim()) : []
    } else {
      profileData.num_criancas = document.getElementById("profile-num-children").value
      profileData.idades_criancas = document.getElementById("profile-children-ages").value
      profileData.necessidades_especiais = document.getElementById("profile-special-needs").value
    }

    const response = await fetch(`${API_BASE_URL}/update_profile.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    })

    const data = await response.json()

    if (data.success) {
      showProfileMessage("Perfil atualizado com sucesso!", "success")
      // Atualizar dados do usuário atual
      currentUser.nome = profileData.nome
      localStorage.setItem("currentUser", JSON.stringify(currentUser))
    } else {
      showProfileMessage(data.message || "Erro ao atualizar perfil", "error")
    }
  } catch (error) {
    console.error("Erro ao salvar perfil:", error)
    showProfileMessage("Erro ao conectar ao servidor", "error")
  } finally {
    saveButton.disabled = false
    hideLoading()
  }
}

function changePhoto() {
  document.getElementById("photo-input").click()
}

async function handlePhotoUpload(event) {
  const file = event.target.files[0]
  if (!file || !currentUser) return

  try {
    showLoading()

    const formData = new FormData()
    formData.append("photo", file)
    formData.append("user_id", currentUser.id)

    const response = await fetch(`${API_BASE_URL}/upload_photo.php`, {
      method: "POST",
      body: formData,
    })

    const data = await response.json()

    if (data.success) {
      // Atualizar foto na interface
      const photoElement = document.getElementById("profile-photo")
      photoElement.innerHTML = `<img src="${data.photo_url}" alt="Foto do perfil">`

      showProfileMessage("Foto atualizada com sucesso!", "success")
    } else {
      showProfileMessage(data.message || "Erro ao atualizar foto", "error")
    }
  } catch (error) {
    console.error("Erro ao fazer upload da foto:", error)
    showProfileMessage("Erro ao conectar ao servidor", "error")
  } finally {
    hideLoading()
  }
}

function showProfileMessage(message, type) {
  const messageElement = document.getElementById("profile-message")
  messageElement.textContent = message
  messageElement.className = `profile-message ${type}`
  messageElement.style.display = "block"

  setTimeout(() => {
    messageElement.style.display = "none"
  }, 5000)
}

// Função para alternar campos no registro
function toggleRegisterFields() {
  const userType = document.querySelector('input[name="userType"]:checked').value
  const babysitterFields = document.getElementById("babysitter-fields")
  const parentFields = document.getElementById("parent-fields")

  if (userType === "babysitter") {
    babysitterFields.style.display = "block"
    parentFields.style.display = "none"
  } else {
    babysitterFields.style.display = "none"
    parentFields.style.display = "block"
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Verificar se há usuário logado
  const savedUser = localStorage.getItem("currentUser")
  if (savedUser) {
    currentUser = JSON.parse(savedUser)
    loadBabysitters().then(() => {
      showMainScreen()
    })
  } else {
    // Mostrar tela de login por padrão
    showLogin()
  }

  // Adicionar event listeners
  document.getElementById("login-form-element").addEventListener("submit", handleLogin)
  document.getElementById("register-form-element").addEventListener("submit", handleRegister)
  document.getElementById("message-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  })
  document.getElementById("send-message-btn").addEventListener("click", sendMessage)
  document.getElementById("photo-input").addEventListener("change", handlePhotoUpload)
})
