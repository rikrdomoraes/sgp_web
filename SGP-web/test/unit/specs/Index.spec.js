import Vue from 'vue'
import Index from '../../../src/components/modules/dashboard/Index'
import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)
window.axios = require('axios')
import { mount } from '@vue/test-utils'

describe('Index.vue', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(Index)
  })
  it('is a Vue Instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
  it('acha inicial', () => {
    const div = wrapper.find('h1')
    expect(div.text()).toBe('Inicial')
  })
  it('acha Proposta', () => {
    const div = wrapper.find('.box-title')
    expect(div.text()).toBe('Propostas')
  })
  it('contem tabela', () => {
    expect(wrapper.find('table').is('table')).toBe(true)
  })
  it('contem header ', () => {
    expect(wrapper.find('table').text()).toContain('Data de inclusão')
    expect(wrapper.find('table').text()).toContain('Entidade')
    expect(wrapper.find('table').text()).toContain('Proposta')
    expect(wrapper.find('table').text()).toContain('Fase')
    expect(wrapper.find('table').text()).toContain('Tipo')
    expect(wrapper.find('table').text()).toContain('Ações')
  })
  it('verifica se tabela esta preenchida ', function () {
    expect(wrapper.find('table').contains('td'))
  })
})
