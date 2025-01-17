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
                script {
                    def branchName = env.GIT_BRANCH.replace('origin/', '')
                    bat "docker build -t devops_node_react_server:${branchName} ."
                        withCredentials([usernamePassword(credentialsId: 'docker_hub_credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                                    bat "docker login -u $DOCKER_USER -p $DOCKER_PASS" 
                                    bat "docker push devops_node_react_server:${branchName}" 
                }
                }    
            }
            }
        }
}
}