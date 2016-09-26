
import Vue from 'vue'
import store from '../../../../src/vuex/store'
import Promise from 'bluebird'
import {mockedComponent, mockedDirective} from '../helper'
const loginInjector = require('!!vue?inject!../../../../src/components/Login')
const loginFormInjector = require('!!vue?inject!../../../../src/components/Common/Login/Form')

describe('LoginForm.vue', () => {
  describe('methods Tests', () => {
    let injectMock = (loginStub) => {
      let LoginForm = loginFormInjector({
        '../../../directives/focus.directive': mockedDirective,
        '../../../vuex/modules/auth/actions': {
          doLogin: loginStub
        }
      })

      return new Vue({
        template: '<div><login-form v-ref:form></login-form></div>',
        components: {LoginForm},
        replace: false,
        store: store
      }).$mount()
    }

    describe('login', () => {
      it('should display the error when login fail', (done) => {
        let vm = injectMock(
          sinon.stub().returns(Promise.reject(new Error('error')))
        )

        vm.$refs.form.login()

        setTimeout(() => {
          expect(vm.$refs.form.error).to.equals('error')
          done()
        }, 0)
      })

      it('should call onLogin callback if success', (done) => {
        let vm = injectMock(
          sinon.stub().returns(Promise.resolve())
        )
        vm.$refs.form.onLogin = sinon.spy()
        vm.$refs.form.login()

        setTimeout(() => {
          expect(vm.$refs.form.onLogin.called).to.be.ok
          expect(vm.$refs.form.error).to.be.null
          done()
        }, 0)
      })
    })
  })
})

describe('Login.vue', () => {
  describe('methods Tests', () => {
    let vm
    let Login = loginInjector({
      './Common/Login/Form': mockedComponent
    })

    beforeEach(() => {
      vm = new Vue({
        template: '<div><login v-ref:login></login></div>',
        components: {Login},
        replace: false,
        store: store
      }).$mount()
    })

    describe('onLogin', () => {
      it('should redirect on previous page if any', (done) => {
        vm.$refs.login.$router = {
          _prevTransition: {
            to: {path: '/foo'}
          },
          go: params => {
            expect(params).be.deep.equal({path: '/foo'})
            done()
          }
        }
        vm.$refs.login.onLogin()
      })
      it('should redirect on home page if there is no previous page', (done) => {
        vm.$refs.login.$router = {
          go (params) {
            expect(params).be.deep.equal({name: 'Home'})
            done()
          }
        }
        vm.$refs.login.onLogin()
      })
    })
  })
})
