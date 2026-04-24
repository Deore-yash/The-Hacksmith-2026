import java.awt.*;
import javax.swing.*;

public class HotelBillForm extends JFrame {

    // Instance variables (Encapsulation)
    private JTextField nameField, ageField, contactField, nightsField, rateField;
    private JComboBox<String> roomBox;
    private JTextArea billArea;
    private JButton submitBtn;

    // Constructor
    public HotelBillForm() {
        setTitle("Hotel Billing System");
        setSize(500, 600);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        createUI();
        setVisible(true);
    }

    // Method to create UI
    private void createUI() {
        JPanel panel = new JPanel(new GridLayout(8, 2, 10, 10));

        nameField = new JTextField();
        ageField = new JTextField();
        contactField = new JTextField();
        nightsField = new JTextField();
        rateField = new JTextField();
        rateField.setEditable(false);

        String[] roomTypes = {"Single", "Double", "Suite"};
        roomBox = new JComboBox<>(roomTypes);

        billArea = new JTextArea(12, 40);
        billArea.setEditable(false);

        submitBtn = new JButton("Book Room");

        // Add components
        panel.add(new JLabel("Customer Name:"));
        panel.add(nameField);

        panel.add(new JLabel("Age:"));
        panel.add(ageField);

        panel.add(new JLabel("Contact Number:"));
        panel.add(contactField);

        panel.add(new JLabel("Room Type:"));
        panel.add(roomBox);

        panel.add(new JLabel("Number of Nights:"));
        panel.add(nightsField);

        panel.add(new JLabel("Rate per Night:"));
        panel.add(rateField);

        panel.add(new JLabel(""));
        panel.add(submitBtn);

        add(panel, BorderLayout.NORTH);
        add(new JScrollPane(billArea), BorderLayout.CENTER);

        setRate();
        addEvents();
    }

    // Method to set rate
    private void setRate() {
        String type = (String) roomBox.getSelectedItem();

        switch (type) {
            case "Single":
                rateField.setText("700");
                break;
            case "Double":
                rateField.setText("1500");
                break;
            case "Suite":
                rateField.setText("3000");
                break;
        }
    }

    // Method for event handling
    private void addEvents() {

        roomBox.addActionListener(e -> setRate());

        submitBtn.addActionListener(e -> generateBill());
    }

    // Method to generate bill
    private void generateBill() {
        try {
            String name = nameField.getText().trim();
            String age = ageField.getText().trim();
            String contact = contactField.getText().trim();
            String nightsText = nightsField.getText().trim();

            if (name.isEmpty() || age.isEmpty() || contact.isEmpty() || nightsText.isEmpty()) {
                JOptionPane.showMessageDialog(this, "All fields are required!");
                return;
            }

            int nights = Integer.parseInt(nightsText);
            double rate = Double.parseDouble(rateField.getText());
            double total = nights * rate;

            String bill =
                    "----- Hotel Bill -----\n" +
                    "Customer Name: " + name + "\n" +
                    "Age: " + age + "\n" +
                    "Contact: " + contact + "\n" +
                    "Room Type: " + roomBox.getSelectedItem() + "\n" +
                    "Number of Nights: " + nights + "\n" +
                    "Rate per Night: Rs." + rate + "\n" +
                    "Total Amount: Rs." + total + "\n" +
                    "----------------------";

            billArea.setText(bill);

        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this, "Enter valid number!");
        }
    }

    // Main method (object creation)
    public static void main(String[] args) {
        new HotelBillForm();
    }
}