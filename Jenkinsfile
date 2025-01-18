pipeline {
    agent any



    stages {
 



        stage('Build & Push Image') {
            steps {
                script {
                    bat """
                        cd server
                        docker build -t ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}:${BRANCH_NAME} -f ./Dockerfile .
                        echo "${DOCKER_HUB_PASSWORD}" | docker login -u ${DOCKER_HUB_USERNAME} --password-stdin
                        docker push ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}:${BRANCH_NAME}
                    """
                }
            }
        }

        stage('Deploy Application') {
            steps {
                script {
                    bat """
                        docker pull ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}:${BRANCH_NAME}
                        docker-compose up --build
                    """
                }
            }
        }


}
}
