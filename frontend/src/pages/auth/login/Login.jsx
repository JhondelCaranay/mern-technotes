import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setCredentials } from "../../../redux/features/auth/authSLice";
import { useLoginMutation } from "../../../redux/services/auth/authApiSLice";


const Login = () => {
	const userRef = useRef()
	const errRef = useRef()
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [errMsg, setErrMsg] = useState('')

	const navigate = useNavigate()
	const dispatch = useDispatch()

	const [login, { isLoading }] = useLoginMutation()

	useEffect(() => {
		userRef.current.focus()
	}, [])

	useEffect(() => {
		setErrMsg('');
	}, [username, password])


	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const { accessToken } = await login({ username, password }).unwrap()
			console.log("🚀 ~ file: Login.jsx ~ line 33 ~ handleSubmit ~ accessToken", accessToken)
			dispatch(setCredentials({ accessToken }))
			setUsername('')
			setPassword('')
			navigate('/dash')
		} catch (err) {
			console.log("🚀 ~ file: Login.jsx ~ line 39 ~ handleSubmit ~ err", err)
			if (!err.status) {
				setErrMsg('No Server Response');
			} else if (err.status === 400) {
				setErrMsg('Missing Username or Password');
			} else if (err.status === 401) {
				setErrMsg('Unauthorized');
			} else {
				setErrMsg(err.data?.message);
			}
			errRef.current.focus();
		}
	}

	const handleUserInput = (e) => setUsername(e.target.value)
	const handlePwdInput = (e) => setPassword(e.target.value)

	const errClass = errMsg ? "errmsg" : "offscreen"

	if (isLoading) return <p>Loading...</p>

	const content = (
		<section className="public">
			<header>
				<h1>Employee Login</h1>
			</header>
			<main className="login">
				<p ref={errRef} className={errClass} aria-live="assertive">{errMsg}</p>

				<form className="form" onSubmit={handleSubmit}>
					<label htmlFor="username">Username:</label>
					<input
						className="form__input"
						type="text"
						id="username"
						ref={userRef}
						value={username}
						onChange={handleUserInput}
						autoComplete="off"
						required
					/>

					<label htmlFor="password">Password:</label>
					<input
						className="form__input"
						type="password"
						id="password"
						onChange={handlePwdInput}
						value={password}
						required
					/>
					<button className="form__submit-button">Sign In</button>
				</form>
			</main>
			<footer>
				<Link to="/">Back to Home</Link>
			</footer>
		</section>
	)

	return content
};
export default Login;
