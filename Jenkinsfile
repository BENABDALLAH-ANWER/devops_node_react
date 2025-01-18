pipeline {
    agent any

        environment {
        DOCKER_HUB_USERNAME = 'louaisouei'
        DOCKER_HUB_PASSWORD = 'louai2811'
        IMAGE_NAME = "backend/user-api-crud"
        BRANCH_NAME = "release"
    }

    stages {
        stage('Build') {
            steps {
                 dir('server') {
                    bat 'npm install'
                }
            }
        }
        stage('Test') {
            steps {
            dir('server') {
                bat 'npm test'
                 }
            }
        }

        stage('SonarQube analysis') {
            steps {

            dir('server') {
                  script {
                    def scannerHome = tool name: 'sonar'
                    withSonarQubeEnv('sonarQube') {
                        bat "${scannerHome}\\bin\\sonar-scanner -Dsonar.projectKey=crud_user"
                    }
                }
                 }
              
            }
        }

        stage('Build & Push Image') {
            steps {
                script {
                    bat """
                        cd server
                        docker build -t ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}:${BRANCH_NAME} -f ./Dockerfile .
                        echo "${DOCKER_HUB_PASSWORD}" | docker login -u ${DOCKER_HUB_USERNAME} --password-stdin
                        docker push ${IMAGE_NAME}:${BRANCH_NAME}
                    """
                }
            }
        }

        stage('Deploy Application') {
            steps {
                script {
                    bat """
                        docker pull ${IMAGE_NAME}:${BRANCH_NAME}
                        docker-compose up --build
                    """
                }
            }
        }


}
}