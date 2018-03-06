import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/user/LogIn'
import Hobbies from '@/components/user/Hobbies'
import Signup from '@/components/user/SignUp'

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/',
			name: 'Home',
			component: Home
		},
		{
			path: '/login',
			name: 'Login',
			component: Login
		},
		{
			path: '/signup',
			name: 'Signup',
			component: Signup
		},
		{
			path: '/hobbies',
			name: 'Hobbies',
			component: Hobbies
		}
	],
	mode: 'history'
})
