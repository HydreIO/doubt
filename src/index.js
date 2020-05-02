export { default } from './doubt.js'

Number.prototype.ms = function() {
	return new Promise((res, rej) => {
		setTimeout(() => res(), this)
	})
}