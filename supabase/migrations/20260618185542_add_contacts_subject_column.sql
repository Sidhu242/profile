DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contacts' AND column_name = 'subject'
  ) THEN
    ALTER TABLE contacts ADD COLUMN subject text DEFAULT '';
  END IF;
END $$;
