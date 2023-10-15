import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './App.css'
import {
  AppContainer,
  HeaderContainer,
  Image,
  MainContainer,
  Select,
  ProjectsListContainer,
  FailureImage,
  FailureImageContainer,
  RetryButton,
  LoaderContainer,
} from './styledComponents'

import ProjectCard from './ProjectCard/index'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  failure: 'FAILURE',
  inprogress: 'IN PROGRESS',
  success: 'SUCCESS',
}

class App extends Component {
  state = {
    projectsList: [],
    apiStatus: apiStatusConstants.initial,
    category: categoriesList[0].id,
  }

  componentDidMount() {
    this.setState({apiStatus: apiStatusConstants.inprogress})
    this.getProjectsDetails()
  }

  getProjectsDetails = async () => {
    const {category} = this.state
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${category}`
    console.log(apiUrl)
    const response = await fetch(apiUrl)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const updateData = data.projects.map(eachProject => ({
        id: eachProject.id,
        imageUrl: eachProject.image_url,
        name: eachProject.name,
      }))
      this.setState({
        projectsList: updateData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  changeCategory = event => {
    this.setState({category: event.target.value}, this.getProjectsDetails)
  }

  onClickRetry = () => {
    this.getProjectsDetails()
  }

  renderSuccessView = () => {
    const {projectsList} = this.state
    return (
      <ProjectsListContainer>
        {projectsList.map(eachProjectItem => (
          <li key={eachProjectItem.id}>
            <ProjectCard
              eachProjectItem={eachProjectItem}
              key={eachProjectItem.id}
            />
          </li>
        ))}
      </ProjectsListContainer>
    )
  }

  renderFailureView = () => (
    <FailureImageContainer>
      <FailureImage
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We Cannot seem to find the page you are looking for.</p>
      <RetryButton type="button" onClick={this.onClickRetry}>
        Retry
      </RetryButton>
    </FailureImageContainer>
  )

  renderLoaderView = () => (
    <LoaderContainer data-testid="loader">
      <Loader type="ThreeDots" size="22" color="black" />
    </LoaderContainer>
  )

  renderAllApiStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inprogress:
        return this.renderLoaderView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {projectsList} = this.state
    const {apiStatus} = this.state
    console.log(apiStatus)
    console.log(projectsList)
    return (
      <AppContainer>
        <HeaderContainer>
          <Image
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
          />
        </HeaderContainer>
        <MainContainer>
          <Select onChange={this.changeCategory}>
            {categoriesList.map(eachOption => (
              <option key={eachOption.id} value={eachOption.id}>
                {eachOption.displayText}
              </option>
            ))}
          </Select>
          {this.renderAllApiStatus()}
        </MainContainer>
      </AppContainer>
    )
  }
}

export default App
