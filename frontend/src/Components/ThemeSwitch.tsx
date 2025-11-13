import { Button, useMantineColorScheme } from "@mantine/core";
import { FaSun, FaMoon } from "react-icons/fa";


/**
 * Switch to change beween light and dark themes
 */
function ThemeSwitch() {
  const colorscheme = useMantineColorScheme();

  return (
    <Button onClick={colorscheme.toggleColorScheme}>{(colorscheme.colorScheme === 'dark') ? <FaSun /> : <FaMoon />}</Button>
  );
}

export default ThemeSwitch;
