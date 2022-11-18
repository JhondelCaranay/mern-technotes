import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setCredentials } from "../../redux/features/auth/authSLice";
import { useLoginMutation } from "../../redux/services/auth/authApiSLice";

import usePersist from "../../hook/usePersist";
const Login = () => {
	const userRef = useRef() // set focus on username input
	const errRef = useRef() // set focus on error message

	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [errMsg, setErrMsg] = useState('')

	const [persist, setPersist] = usePersist()

	const navigate = useNavigate()
	const dispatch = useDispatch()

	const [login, { isLoading }] = useLoginMutation()

	useEffect(() => {
		// set focus on username input on mount
		userRef.current.focus()
	}, [])

	useEffect(() => {
		// remove error message when username or password changes
		setErrMsg('');
	}, [username, password])


	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const { accessToken } = await login({ username, password }).unwrap()
			// console.log("🚀 ~ file: Login.jsx ~ line 33 ~ handleSubmit ~ accessToken", accessToken)
			console.log("running")
			dispatch(setCredentials({ accessToken }))

			setUsername('')
			setPassword('')
			navigate('/dash')
		} catch (err) {
			// console.log("🚀 ~ file: Login.jsx ~ line 39 ~ handleSubmit ~ err", err)
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
	const handleToggle = () => setPersist(prev => !prev)

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

					<label htmlFor="persist" className="form__persist">
						<input
							type="checkbox"
							className="form__checkbox"
							id="persist"
							onChange={handleToggle}
							checked={persist}
						/>
						Trust This Device
					</label>
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
