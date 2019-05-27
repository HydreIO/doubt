export { default } from './doubt'

Number.prototype.ms = function() {
	return new Promise((res, rej) => {
		setTimeout(() => res(), this)
	})
}