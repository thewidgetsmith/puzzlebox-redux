/* global Blob */
import { build } from './services/labyrinth/daedalus'
import logo from './logo.svg'
import './App.css'

function App () {
  const handleFileDownload = () => {
    const model = build({ })

    const file = new Blob([
      // document.getElementById('myInput').value
      model.content
    ], { type: model.mime })

    const element = document.createElement('a')
    element.href = URL.createObjectURL(file)
    // element.download = 'new_model.scad'
    element.download = model.name

    document.body.appendChild(element) // Required for this to work in FireFox
    element.click()
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className='App-link'
          href='https://reactjs.org'
          rel='noopener noreferrer'
          target='_blank'
        >
          Learn React
        </a>

        <div>
          <input id='myInput' />
          <button onClick={() => handleFileDownload()}>Download txt</button>
        </div>
      </header>
    </div>
  )
}

export default App
