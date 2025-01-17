pipeline {
    agent any

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

        stage('Build Docker Image') {
            steps {
                dir('server') {
                script {
                    def branchName = env.GIT_BRANCH.replace('origin/', '')
                    echo "Building Docker image for branch: ${branchName}"
                    bat "docker build -t devops_node_react_server:${branchName} ."
                }
            }
            }
 
    }

            stage('Push Docker Image') {
            steps {
                 dir('server') {
                echo 'Pushing Docker image...'
                    bat '''
                        docker login -u benabdallah4nwer -p test11DOCKER
                        docker push devops_node_react_server
                    '''
                
            }
            }
        }
}
}