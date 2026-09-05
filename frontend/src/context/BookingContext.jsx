import { createContext, useContext, useState } from 'react'

const BookingContext = createContext()

export function BookingProvider({ children }) {
  const [selectedItems, setSelectedItems] = useState([])
  const [bookingId, setBookingId] = useState(null)

  const addToBooking = (item) => {
    setSelectedItems((currentItems) => {
      const existingItem = currentItems.find(
        (selectedItem) => selectedItem.id === item.id
      )

      if (existingItem) {
        return currentItems.map((selectedItem) =>
          selectedItem.id === item.id
            ? {
                ...selectedItem,
                quantity: selectedItem.quantity + 1,
              }
            : selectedItem
        )
      }

      return [
        ...currentItems,
        {
          ...item,
          quantity: 1,
        },
      ]
    })
  }

  const increaseQuantity = (id) => {
    setSelectedItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    )
  }

  const decreaseQuantity = (id) => {
    setSelectedItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const removeFromBooking = (id) => {
    setSelectedItems((currentItems) =>
      currentItems.filter((item) => item.id !== id)
    )
  }

  const totalAmount = selectedItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  return (
    <BookingContext.Provider
      value={{
        selectedItems,
        addToBooking,
        increaseQuantity,
        decreaseQuantity,
        removeFromBooking,
        totalAmount,
        bookingId,
        setBookingId,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  return useContext(BookingContext)
}