import expect from 'expect';
import passwordStrength from './passwordStrength';

describe('Password Strength', () => {
	it('should pass', () => {
		document.body.innerHTML = '<div class="js-pwstrength"></div>';
		const password = passwordStrength();
		return expect(password.test('2%9ddiaA')).resolves.toEqual('passing');
	});
	it('should fail', async() => {
		expect.assertions(1);
		document.body.innerHTML = '<div class="js-pwstrength"></div>';
		const password = passwordStrength();
		try {
			await password.test('foo');
		} catch (e) {
			expect(e).toEqual('failing');
		}
	});
});
