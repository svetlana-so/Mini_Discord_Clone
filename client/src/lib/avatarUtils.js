import avatar1 from '../assests/avatar1.png'
import avatar2 from '../assests/avatar2.png'
import avatar3 from '../assests/avatar3.png'
import avatar4 from '../assests/avatar4.png'

const avatarAssets = [avatar1, avatar2, avatar3, avatar4]

export const getRandomAvatar = () => {
  const randomIndex = Math.floor(Math.random() * avatarAssets.length)
  return avatarAssets[randomIndex]
}
