package kotlinlang.vcsRoots

import jetbrains.buildServer.configs.kotlin.vcs.GitVcsRoot

object LandingPagesVCS: GitVcsRoot({
    name = "Landing Pages VCS root"
    url = "git@github.com:JetBrains/lp-kotlinlang.org.git"
    branch = "refs/heads/master"
    branchSpec = "+:refs/heads/*"
    checkoutPolicy = AgentCheckoutPolicy.AUTO
    authMethod = uploadedKey {
        uploadedKey = "default teamcity key"
    }
})
