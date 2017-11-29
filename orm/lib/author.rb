class Author
  
  def self.set_attributes
    self.column_names.each do |col|
      attr_accessor(col.to_sym)
    end
  end


  def self.table_name
    "authors"
  end

  def self.column_names
    ["id", "name"]
    # result = DB[:conn].execute("PRAGMA table_info (#{self.table_name})")
    # result.map do |col_info|
    #   col_info['name']
    # end
  end


  def self.all
    sql = <<-SQL
      SELECT * FROM #{table_name}
    SQL

    results = DB[:conn].execute(sql)
    results.map do |row|
      
      props = row.reject do |k, v|
        
        k.is_a?(Fixnum)
      end

      self.new(props)
    end
  end
  
  
  def self.last
    all.last
  end

  def initialize(props={})
    # {'message' => 'coffee', 'username' =< 'coffee_dad'}
    # iterate over all key/values pairs in this hash
    # for each one of those
    # call my setter method, self.message = 'coffee', self.username= 'coffee_dad'
    props.each do |attribute, value|
      self.send("#{attribute}=", value)
    end

  end

  # tweet = Tweet.new({'username' => 'coffee_dad', 'message' => 'coffee'})
  # tweet.save

  def save
      insert
    self
  end


  def values_for_insert
    # "INSERT INTO tweets (message, username) VALUES ('coffee', 'coffee_dad')"
    attributes = self.class.column_names.reject { |col| col == 'id' }
    
    attributes.map do |attribute|
      "'#{self.send(attribute)}'"
    end.join(', ')

  end
  
  
  set_attributes

  private

  def self.col_names_for_insert
    column_names.reject { |col| col == 'id' }.join(', ')
  end


  def insert
    sql = <<-SQL
    INSERT INTO authors ("name")
    VALUES (#{self.values_for_insert})
    SQL

    DB[:conn].execute(sql)

    last_row_sql = <<-SQL
    SELECT id FROM #{self.class.table_name}
    ORDER BY id DESC
    LIMIT 1
    SQL

    @id = DB[:conn].execute(last_row_sql).first['id']
  end

  

end