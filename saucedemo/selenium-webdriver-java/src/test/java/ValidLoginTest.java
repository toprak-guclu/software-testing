import org.junit.Test;
import org.junit.Before;
import org.junit.After;
import static org.junit.Assert.*;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class ValidLoginTest {

  private WebDriver driver;
  private WebDriverWait wait;

  @Before
  public void setUp() {
    driver = new ChromeDriver();
    driver.manage().window().maximize();
    wait = new WebDriverWait(driver, Duration.ofSeconds(10));
  }

  @After
  public void tearDown() {
    driver.quit();
  }

  @Test
  public void validLoginTest() {
    driver.get("https://www.saucedemo.com/");

    driver.findElement(By.cssSelector("[data-test=\"username\"]")).sendKeys("standard_user");
    driver.findElement(By.cssSelector("[data-test=\"password\"]")).sendKeys("secret_sauce");
    driver.findElement(By.cssSelector("[data-test=\"login-button\"]")).click();

    // Wait for the product page instead of checking immediately after the click.
    wait.until(ExpectedConditions.urlContains("inventory.html"));
    assertTrue(wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("inventory_list"))).isDisplayed());
  }
}
