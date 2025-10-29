-- create the database 
CREATE DATABASE feedbackdb;

-- create the feedbacks table
CREATE TABLE feedbacks (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,  -- auto-incremented id
  rating INT NOT NULL,  -- numeric rating (1-5)
  message TEXT,  -- user's feedback text
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- automatically sets the current time
);

-- check if records are stored correctly
select * from feedbacks;

-- add a new column to the table for storing the excellent, good, average, poor, terrible labels
ALTER TABLE feedbacks ADD COLUMN rating_label VARCHAR(20);

-- update the new column based on the rating value
UPDATE feedbacks
SET rating_label = CASE
  WHEN rating = 1 THEN 'terrible'
  WHEN rating = 2 THEN 'poor'
  WHEN rating = 3 THEN 'average'
  WHEN rating = 4 THEN 'good'
  WHEN rating = 5 THEN 'excellent'
  ELSE NULL
END;

-- verify the updates
SELECT * FROM feedbacks;


