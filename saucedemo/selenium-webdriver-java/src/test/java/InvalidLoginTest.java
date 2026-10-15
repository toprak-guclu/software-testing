import org.junit.Test;
import org.junit.Before;
import org.junit.After;
import static org.junit.Assert.*;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class InvalidLoginTest {

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
  public void invalidLoginTest() {
    driver.get("https://www.saucedemo.com/");

    driver.findElement(By.cssSelector("[data-test=\"username\"]")).sendKeys("standard_user");
    driver.findElement(By.cssSelector("[data-test=\"password\"]")).sendKeys("secret_sauce1");
    driver.findElement(By.cssSelector("[data-test=\"login-button\"]")).click();

    // Wait until the error message is shown instead of reading it immediately after the click.
    WebElement errorMessage = wait.until(
        ExpectedConditions.visibilityOfElementLocated(By.cssSelector("[data-test=\"error\"]")));

    assertTrue(errorMessage.isDisplayed());
    assertTrue(errorMessage.getText().contains("Username and password do not match"));
  }
}
