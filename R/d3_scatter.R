#' Scatter plot made with D3
#'
#' @param data A Dataset to use for plotting. Should be a dataframe
#' @param x_var Attribute to place on the x axis
#' @param y_var Attribute for the y axis. If *y_var* is not specified or NULL, the *x_var* will be counted
#' @param title Title for the plot, placed above plot
#' @param x_lab X axis label. Default is *x_var's* object name
#' @param y_lab Y axis label. Default is *y_var's* ovject name
#' @param point_size Size of the data points on the plot
#' @param color Color of the points. This value can be a hex color, color name, or the column name from the dataframe
#' @param stroke_width Border thickness for each data point
#' @param opacity transparency level
#'
#' @return An HTML widget that displays a scatter plot made with D3.js
#' @export
#'
#' @examples
#' # not run:
#' # d3_scatter(mtcars, mpg, hp)
d3_scatter <- function (data, x_var, y_var, title = NULL, x_lab = NULL, y_lab = NULL, point_size = 3, color = "black", stroke_width = 1, opacity = 1) {

  x_name <- quo_name(enquo(x_var))
  y_name <- quo_name(enquo(y_var))

  if(is.null(x_lab)) x_lab <- x_name
  if(is.null(y_lab)) y_lab <- y_name

  r2d3(data = data,
       script = here::here("inst", "d3_scatter.js"),
       height = 500, width = 500,
       options = list(xvar = x_name,
                      yvar = y_name,
                      title = list(title = title),
                      xaxis = list(title = x_lab),
                      yaxis = list(title = y_lab),
                      marker = list(size = point_size,
                                    color = color,
                                    strokewidth = stroke_width,
                                    opacity = opacity),
                      layout = list(margin = list(l = 50,
                                                  r = 50,
                                                  b = 80,
                                                  t = 50))))

}
