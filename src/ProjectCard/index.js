import {
  ProjectCardContainer,
  Image,
  Title,
  TitelContainer,
} from './styledComponents'

const ProjectCard = props => {
  const {eachProjectItem} = props
  const {name, imageUrl} = eachProjectItem
  return (
    <ProjectCardContainer>
      <Image src={imageUrl} alt={name} />
      <TitelContainer>
        <Title>{name}</Title>
      </TitelContainer>
    </ProjectCardContainer>
  )
}

export default ProjectCard
