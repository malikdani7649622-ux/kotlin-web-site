package kotlinlang

import jetbrains.buildServer.configs.kotlin.Project
import kotlinlang.builds.*
import kotlinlang.builds.landing.LandingPages
import kotlinlang.vcsRoots.GrammarGenerator
import kotlinlang.vcsRoots.KotlinSpec
import kotlinlang.vcsRoots.LandingPagesVCS
import kotlinlang.vcsRoots.WebHelp
import templates.DockerImageBuilder

object SiteProject : Project({
    name = "kotlinlang.org"

    buildTypesOrder = arrayListOf(
        BuildSitePages,
        FetchBlogNews,
        PdfGenerator,
        BuildSearchIndex,
        BuildWebHelpFrontend,
        BuildKotlinGrammar,
        BuildKotlinSpec,
        BuildJsAssets,
        PageViews,
        BuildPythonContainer,
    )

    buildTypesOrder.forEach {
        buildType(it)
    }

    template(DockerImageBuilder)
    subProjects(LandingPages)

    vcsRoot(GrammarGenerator)
    vcsRoot(KotlinSpec)
    vcsRoot(WebHelp)
    vcsRoot(LandingPagesVCS)
})
