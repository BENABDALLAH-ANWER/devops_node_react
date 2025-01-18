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
        stage('U&I Test') {
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

}
}