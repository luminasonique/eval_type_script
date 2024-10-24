import { StartedDockerComposeEnvironment , DockerComposeEnvironment} from 'testcontainers'
import path from 'path'




let instance :  StartedDockerComposeEnvironment | null = null




export const startDocker = async () => {

    const composeFilePath = path.resolve(__dirname)

    const composeFile = 'docker-compose.yml'

    instance = await new DockerComposeEnvironment(composeFilePath, composeFile).up()

    console.log('\nDocker compose instance is running and started')




    
}

export const stopDocker = async () => {



    if(!instance) return

    try {
        await instance.down()
        instance = null
        console.log('\nDocker compose instance is stopped')

    } catch (error) {
        console.error('An error occurred:', error);
    }
}

export const getDockerInstance = () => {
    if(!instance) throw new Error('Docker compose instance is not running')
    return instance
}