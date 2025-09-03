package kotlinlang.builds.landing

import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.ParameterDisplay
import jetbrains.buildServer.configs.kotlin.Project
import jetbrains.buildServer.configs.kotlin.buildSteps.script
import kotlinlang.vcsRoots.LandingPagesVCS

object LandingPages : Project({
    name = "Landing Pages"
    buildType(BuildLandingPages)
})

object BuildLandingPages: BuildType ({
    name = "Build landing pages"

    artifactRules = "landings/%LANDING_NAME%/public => build.zip"

    params {
        select(
            "LANDING_NAME",
            "",
            label = "Landing Name",
            display = ParameterDisplay.PROMPT,
            options = listOf("test", "multiplatform", "server-side", "event-14", "kotlin-heroes", "10yearsofkotlin", "mobile")
        )
    }

    vcs {
        root(LandingPagesVCS)
    }

    steps {
        script {
            name = "Build landing"
            workingDir = "landings/%LANDING_NAME%/"
            scriptContent = """
                #!/bin/bash
                set -e
                
                echo "##teamcity[buildStatus text='%LANDING_NAME%']"
                
                yarn install --frozen-lockfile
                yarn build
            """.trimIndent()
            dockerImage = "node:14"
        }
    }

    requirements {
        equals("docker.server.osType", "linux")
    }
})
