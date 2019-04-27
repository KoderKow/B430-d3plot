#' Interactive data exploration
#'
#' @return Shiny Gadget that uses the D3 functions
#' @export
#'
#' @import shiny
#' @import miniUI
#' @import r2d3
#' @import rlang
#' @import htmlwidgets
#' @import stringr
#'
#' @examples
#' # not run:
#' # d3_gadget()
d3_gadget <- function() {
  data_options <- names(which(sapply(.GlobalEnv, is.data.frame)))

  ui <- miniPage(
    gadgetTitleBar("D3 Plot Builder"),
    fillRow(height = "50px",
            uiOutput("data_selection"),
            selectInput(inputId = "viz_type",
                        label = "Visual Type",
                        choices = c("Scatter", "Bar", "Histogram", "Line"),
                        selected = "Scatter"),
            uiOutput("x_var"),
            uiOutput("y_var"),
            uiOutput("color")
    ),
    fillRow(div(),
            d3Output("test_graph", height = "500px"),
            div()
    )
  )

  server <- function(input, output, session) {

    selected_data <- reactive({
      req(input$data_options)
      get(input$data_options)
    })

    output$data_selection <- renderUI ({
      selectInput(inputId = "data_options",
                  label = "data.frame",
                  choices = data_options)
    })

    output$x_var <- renderUI ({
      req(selected_data())
      selectInput(inputId = "x_var",
                  label = "X Variable",
                  choices = names(selected_data()))
    })

    output$y_var <- renderUI ({
      req(selected_data())
      if(input$viz_type != "Bar"){
        selectInput(inputId = "y_var",
                    label = "Y Variable",
                    choices = names(selected_data()),
                    selected = names(selected_data())[2])
      }
    })

    output$color <- renderUI ({
      req(selected_data())
      selectInput(inputId = "color",
                  label = "Color By",
                  choices = names(selected_data()))
    })

    x_var <- reactive({input$x_var})
    y_var <- reactive({input$y_var})
    color <- reactive({input$color})

    # observeEvent(input$viz_type, {
    #   shinyjs::runjs("d3.selectAll('svg').selectAll('*').remove();")
    #   shinyjs::runjs("d3.select('.test_graph').selectAll('*').remove();")
    #   shinyjs::runjs("d3.select('svg').remove()")
    # })

    d3_plot <- reactive({

      x_lab <- stringr::str_to_title(x_var())
      y_lab <- stringr::str_to_title(y_var())

      ## scatter ----
      if (input$viz_type == "Scatter") {

        r2d3(data = selected_data(),
             script = here::here("inst", "d3_scatter.js"),
             options = list(xvar = x_var(),
                            yvar = y_var(),
                            title = list(title = NULL,
                                         size = 16),
                            xaxis = list(title = x_lab,
                                         size = 12),
                            yaxis = list(title = y_lab,
                                         size = 12),
                            marker = list(size = 3,
                                          color = color(),
                                          strokewidth = 1,
                                          opacity = 1),
                            layout = list(margin = list(l = 50,
                                                        r = 50,
                                                        b = 80,
                                                        t = 50))))
      } else if (input$viz_type == "Bar") {



        x_name <- x_var()
        varQ <- quo(!!sym(x_name))

        if (is.null(x_lab)) x_lab <- stringr::str_to_title(x_name)

        # if (is.null(y_var())) {
        tmp <- selected_data() %>%
          count(!!varQ) %>%
          mutate(
            x = !!varQ,
            y = n
          )

        r2d3(tmp, "inst/d3_bar.js",
             options = list(xvar = x_var(),
                            yvar = y_var(),
                            title = list(title = NULL,
                                         size = 16),
                            xaxis = list(title = x_lab,
                                         size = 12),
                            yaxis = list(title = y_lab,
                                         size = 12),
                            marker = list(size = 3,
                                          color = color(),
                                          strokewidth = 1,
                                          opacity = 1),
                            bar = list(color = color()),
                            layout = list(margin = list(l = 50,
                                                        r = 50,
                                                        b = 80,
                                                        t = 50))))


      }
    })

    output$test_graph <- renderD3({
      d3_plot()
    })
  }

  runGadget(shinyApp(ui, server),
            viewer = browserViewer(browser = getOption("browser")))
}
