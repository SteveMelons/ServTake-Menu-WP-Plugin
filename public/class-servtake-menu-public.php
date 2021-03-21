<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://techslide.de/
 * @since      1.0.0
 *
 * @package    Servtake_Menu
 * @subpackage Servtake_Menu/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Servtake_Menu
 * @subpackage Servtake_Menu/public
 * @author     Oliver Fabian Fischer <oliverfabianfischer@gmail.com>
 */
class Servtake_Menu_Public
{

  /**
   * The ID of this plugin.
   *
   * @since    1.0.0
   * @access   private
   * @var      string    $plugin_name    The ID of this plugin.
   */
  private $plugin_name;

  /**
   * The version of this plugin.
   *
   * @since    1.0.0
   * @access   private
   * @var      string    $version    The current version of this plugin.
   */
  private $version;

  /**
   * Initialize the class and set its properties.
   *
   * @since    1.0.0
   * @param      string    $plugin_name       The name of the plugin.
   * @param      string    $version    The version of this plugin.
   */
  public function __construct($plugin_name, $version)
  {

    $this->plugin_name = $plugin_name;
    $this->version = $version;

    // add shortcodes
    add_shortcode('servtake-menu', array($this, 'add_menu_container'));
  }

  /**
   * Register the stylesheets for the public-facing side of the site.
   *
   * @since    1.0.0
   */
  public function enqueue_styles()
  {

    /**
     * This function is provided for demonstration purposes only.
     *
     * An instance of this class should be passed to the run() function
     * defined in Servtake_Menu_Loader as all of the hooks are defined
     * in that particular class.
     *
     * The Servtake_Menu_Loader will then create the relationship
     * between the defined hooks and the functions defined in this
     * class.
     */

    wp_register_style('font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css');
    wp_enqueue_style('font-awesome');
    // wp_enqueue_style($this->plugin_name, plugin_dir_url(__FILE__) . 'css/servtake-menu-public.css', array(), $this->version, 'all');
  }

  /**
   * Register the JavaScript for the public-facing side of the site.
   *
   * @since    1.0.0
   */
  public function enqueue_scripts()
  {

    /**
     * This function is provided for demonstration purposes only.
     *
     * An instance of this class should be passed to the run() function
     * defined in Servtake_Menu_Loader as all of the hooks are defined
     * in that particular class.
     *
     * The Servtake_Menu_Loader will then create the relationship
     * between the defined hooks and the functions defined in this
     * class.
     */
  }

  /**
   * Enqueues the script file, reads menu.json and passes it to the script and then returns the menu-container HTML string.
   *
   * @access public
   * 
   * @return string HTML string of menui-container
   */
  public function add_menu_container()
  {
    // load js and css files
    $pluginDir = plugin_dir_url(__FILE__);

    wp_enqueue_script($this->plugin_name, plugin_dir_url(__FILE__) . 'js/servtake-menu.js', array('jquery'), $this->version, false);

    // pass variables to javascript
    // $content = file_get_contents($pluginDir . 'menu.json');
    $content = get_option('servtake_menu_menu_data');

    wp_localize_script(
      $this->plugin_name,
      'menuJSONData',
      array($content)
    );

    $htmlString = '<div id="servtake-container"></div>';
    return $htmlString;
  } // end add_menu_container
}
