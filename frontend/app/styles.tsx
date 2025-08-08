import { StyleSheet } from 'react-native'

export const colors = {
    bgColor: '#fff',
    textColor: '#000',
    themeColor: '#22b005'
}

export const tabBar = {
    bgColor: '#22b005',
    selectedColor: '#22b005',
    textColor: colors.textColor,
    iconSize: 24
}

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',

  },
  options: {
    alignItems: 'center'
  },
  link: {
    color: colors.themeColor,
    textDecorationLine: 'underline'
  },
  form: {
    alignItems: 'center',
    position: 'relative',
    top: -50
  },
  title: {
    color: '#000',
    fontSize: 25,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 30
  },
  inputLabel: {
    marginTop: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#22b005',
    borderRadius: 3,
    borderWidth: 1,
    minWidth: 100,
    marginTop: 8,
    minHeight: 25,
    padding: 5
  },
  errorMessage: {
    color: 'red',
    marginTop: 10
  },
  button: {
    minWidth: 120,
    minHeight: 50,
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    backgroundColor: '#22b005',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  info: {
    position: 'relative',
    fontSize: 20,
    top: 20
  }
});