// Função usada para verificar se o usuário logado é da FBB
export const isFundacao = {
  methods: {
    isFundacao (usuario) {
      if (usuario.userType === 'FUNDACAO') {
        return usuario.userType === 'FUNDACAO'
      }
    }
  }
}
