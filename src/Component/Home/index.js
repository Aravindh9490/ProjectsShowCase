import Loader from 'react-loader-spinner'
import {Component} from 'react'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatuesProgress = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class Home extends Component {
  state = {
    apiData: [],
    displayStatues: apiStatuesProgress.initial,
    category: categoriesList[0].id,
  }

  componentDidMount() {
    this.getApi()
  }

  getApi = async () => {
    this.setState({displayStatues: apiStatuesProgress.loading})
    const {category} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${category}`
    const response = await fetch(url)
    const data = await response.json()
    if (response.ok) {
      const updatedData = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({
        apiData: updatedData,
        displayStatues: apiStatuesProgress.success,
      })
    } else {
      this.setState({displayStatues: apiStatuesProgress.failure})
    }
  }

  successView = () => {
    const {apiData} = this.state

    return (
      <div className="p-4 ">
        <ul className="list-unstyled d-flex flex-row justify-content-center flex-wrap">
          {apiData.map(each => (
            <li className="m-2 " key={each.id}>
              <img className="rounded" src={each.imageUrl} alt={each.name} />
              <p>{each.name}</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  loadingView = () => (
    <div
      data-testid="loader"
      className="d-flex flex-row justify-content-center align-items-center"
    >
      <Loader
        type="TailSpin"
        color="black"
        height={70}
        width={70}
        timeout={5000}
      />
    </div>
  )

  failureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" className="btn btn-primary" onClick={this.getApi}>
        Retry
      </button>
    </div>
  )

  finalResult = () => {
    const {displayStatues} = this.state

    switch (displayStatues) {
      case 'SUCCESS':
        return this.successView()
      case 'FAILURE':
        return this.failureView()
      case 'LOADING':
        return this.loadingView()

      default:
        return null
    }
  }

  render() {
    return (
      <div className="p-3">
        <div>
          <img
            className="w-25"
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
          />
        </div>
        <div className="m-4 p-4 w-25">
          <select
            className="form-select"
            onChange={e =>
              this.setState({category: e.target.value}, this.getApi)
            }
          >
            {categoriesList.map(each => (
              <option key={each.id} value={each.id}>
                {each.displayText}
              </option>
            ))}
          </select>
        </div>
        {this.finalResult()}
      </div>
    )
  }
}

export default Home
