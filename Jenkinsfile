pipeline {
    agent any

        environment {
        DOCKER_HUB_USERNAME = 'louaisouei'
        DOCKER_HUB_PASSWORD = 'louai2811'
        IMAGE_NAME = "backend-user-api"
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
                        @echo off
:: Check if the script is run as Administrator
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo This script requires Administrator privileges. Please run it as Administrator.
    pause
    exit /b
)

:: Run Docker login with admin privileges
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