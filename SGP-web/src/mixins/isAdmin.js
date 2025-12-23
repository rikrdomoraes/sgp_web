// Função usada para verificar se o usuário logado é da GETEC
export const isAdmin = {
  methods: {
    isAdmin (usuario) {
      return usuario.profilesConstraint.some((perfil) => {
        if (perfil.active === true) {
          return perfil.profile.name === 'Getec'
        }
      })
    }
  }
}
