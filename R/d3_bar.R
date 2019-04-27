#' Bar plot D3
#'
#' @param data A Dataset to use for plotting. Should be a dataframe
#' @param x_var Attribute to place on the x axis
#' @param y_var Attribute for the y axis. If *y_var* is not specified or NULL, the *x_var* will be counted
#' @param title Title for the plot, placed above plot
#' @param x_lab X axis label. Default is *str_to_title(x_var)*
#' @param y_lab Y axis label. Default is *str_to_title(y_var)*
#' @param title_size Text size of the title
#' @param color Color of the bars. This value can be a hex color, color name, or the column name from the dataframe
#' @param border Color of the border of the bars
#' @param opacity transparency level
#'
#' @return An HTML widget that displays a bar plot made with D3.js
#' @export
#'
#' @import dplyr
#' @import rlang
#' @importFrom r2d3 r2d3
#'
#' @examples
#' # not run:
#' # d3_bar(mtcars, am)
d3_bar <- function (data, x_var, y_var = NULL, title = NULL, x_lab = NULL, y_lab = NULL, title_size = 18, color = "black", border = NULL, opacity = 1) {


  x_quo <- rlang::enquo(x_var)
  y_quo <- rlang::enquo(y_var)

  x_name <- rlang::quo_name(enquo(x_var))
  y_name <- rlang::quo_name(enquo(y_var))
  x_group <- rlang::quo(!!rlang::sym(x_name))

  if (is.null(x_lab)) x_lab <- x_name
  if (is.null(y_var)) y_lab <- "Count"

  if (is.null(y_var)) {
    tmp <- data %>%
      dplyr::count(!!x_group) %>%
      dplyr::mutate(
        x = !!x_group,
        y = n
      )
  } else {
    tmp <- data %>%
      dplyr::rename(x = !!x_quo, y = !!y_quo)
  }

  r2d3(data = tmp,
       script = paste0(here::here(),"/inst/bar_plot.js"),
       options = list(x_name = x_name,
                      y_name = y_name,
                      title = list(title = title,
                                   size = title_size),
                      xaxis = list(title = x_lab),
                      yaxis = list(title = y_lab),
                      bar = list(color = color,
                                 border = border,
                                 opacity = opacity)))
}
