def projectName = "@mergermarket/pow-mongodb-fixtures"

pipeline {
    agent {
        node {
            label "swarm2"
        }
    }

    stages {
        stage("Test") {
            steps {
                ansiColor("xterm") {
                    writeNpmConfig()
                    sh "./scripts/run-unit-tests.sh"
                }
            }
        }

        stage("Check if should publish") {
            steps {
                ansiColor("xterm") {
                    sh "docker run $projectName ./scripts/should-publish.sh && echo true > should-publish.txt || echo false > should-publish.txt"
                }
            }
        }

        stage("Publish") {
            steps {
                ansiColor("xterm") {
                    sh "[ \"true\" == \"\$(cat should-publish.txt)\" ] && docker run $projectName npm --verbose publish || echo Not publishing because should not publish"
                }
            }
        }
    }
}

def writeNpmConfig() {
    withCredentials([string(credentialsId: "github-credentials-token", variable: "GITHUB_TOKEN")]) {
        sh "./scripts/write-npm-config.sh"
    }
}
