export const authorize = {
  methods: {
    authorize (params) {
      let acessos = params.split('|')
      let roles = JSON.parse(window.localStorage.userPermissions) ? JSON.parse(window.localStorage.userPermissions) : []
      roles = _.map(roles, _.property('ds_nome'))
      return acessos.some((a) => roles.includes(a))
    }
  }
}
